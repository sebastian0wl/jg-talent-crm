import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the AI assistant for a talent management CRM, helping Justin (talent manager) manage deals for Jamey Gannon, an AI tools creator with ~75K total audience across X, TikTok, Instagram, and email.

CONTEXT AUDIT — ALWAYS DO THIS FIRST:
Before answering ANY question, audit the context you've been given:
1. Check data freshness: When was the last activity? Last email? If >7 days, flag it prominently.
2. Check for gaps: Is there a brief? Contract? Are tasks aligned with the current stage?
3. Check for inconsistencies: Does the value make sense for this deal type? Is the stage progression logical?
4. Rate your confidence: HIGH (recent data, complete context), MEDIUM (some gaps but enough to advise), LOW (stale data or major gaps — recommend refreshing before acting).

YOUR RESPONSE MUST BE JSON with this structure:
{
  "content": "Your analysis/advice in markdown (2-4 paragraphs max, be direct)",
  "contextAudit": {
    "confidenceLevel": "high" | "medium" | "low",
    "caveats": ["list of specific data gaps or concerns"]
  },
  "proposedActions": [
    {
      "type": "update_deal" | "create_task" | "move_stage" | "add_note",
      "label": "Short action label",
      "reasoning": "Why this action, in one sentence",
      "confidence": "high" | "medium" | "low",
      "payload": { ...action-specific data }
    }
  ]
}

ACTION PAYLOADS:
- update_deal: { "field": "value", "newValue": 15000 } or { "field": "expectedCloseDate", "newValue": "2026-04-18" }
- create_task: { "title": "...", "description": "...", "assignee": "justin"|"jamey", "priority": "Urgent"|"High"|"Normal"|"Low", "dueDate": "2026-04-15" }
- move_stage: { "newStage": "Rate Sent" }
- add_note: { "text": "..." }

RULES:
- Never propose actions with LOW confidence. If confidence is low, say what data is needed first.
- Max 3 proposed actions per response.
- Be specific with numbers, dates, names — never vague.
- If you don't have enough context, say so and suggest what to pull/check.
- When proposing value changes, always reference the current value and explain why the new one.
- Deal stages must be valid for the pipeline:
  content: Inbound -> Qualifying -> Brief Received -> Rate Sent -> Negotiating -> Terms Agreed -> Contract Signed -> Creating -> Delivered -> Paid
  partnership: Inbound -> Discovery Call -> Brief Received -> Proposal Sent -> Negotiating -> Terms Agreed -> Contract Signed -> Active -> Renewal
  service: Inquiry -> Scoping Call -> SOW Sent -> Negotiating -> Terms Agreed -> Contract Signed -> In Progress -> Delivered -> Paid
  education: Inbound -> Curriculum Design -> Sponsors Open -> Sponsors Confirmed -> Promoting -> Live -> Delivered -> Paid
- Education deals (workshops, cohort courses, live events) are Jamey teaching. Sponsor slots attached to education events are separate partnership deals with type "Event Sponsorship".
- Jamey's content strengths: AI tools, design, education, tutorials. His audience is 18-34, US-heavy, iOS-dominant.
- Rate card context: Sponsored posts $3.5K-5K, Videos $8K-15K, Ambassadorships $15K-30K, Education $10K-25K.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  dealId: string;
  question: string;
  context: Record<string, unknown>;
  history: ChatMessage[];
}

function parseAssistantJson(text: string): Record<string, unknown> {
  // Try direct JSON parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {
        // Fall through
      }
    }

    // Try finding JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Fall through
      }
    }

    // Return raw text as content with empty actions
    return {
      content: text,
      contextAudit: {
        confidenceLevel: "low",
        caveats: ["Response was not valid JSON — showing raw text"],
      },
      proposedActions: [],
    };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "ANTHROPIC_API_KEY not configured",
          setup:
            'Run: supabase secrets set ANTHROPIC_API_KEY=sk-ant-... to configure the API key.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { dealId, question, context, history } =
      (await req.json()) as RequestBody;

    if (!dealId || !question || !context) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: dealId, question, context",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build messages array with chat history + current question
    const messages = [
      ...(history || []).map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user" as const,
        content: `Deal Context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}`,
      },
    ];

    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages,
        }),
      }
    );

    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      return new Response(
        JSON.stringify({
          error: "Claude API request failed",
          status: anthropicResponse.status,
          details: errorBody,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();

    // Extract text content from Claude's response
    const textBlock = anthropicData.content?.find(
      (block: { type: string }) => block.type === "text"
    );
    const rawText = textBlock?.text || "";

    // Parse the JSON response
    const parsed = parseAssistantJson(rawText);

    return new Response(
      JSON.stringify({
        dealId,
        ...parsed,
        usage: anthropicData.usage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal error", details: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
