# 4. Content Types

## Decision Records (ADRs)
**Structure:** Context → Decision → Rationale → Consequences → Alternatives → Implementation → References

**Index file:** Summarize ID, title, status, and link to each `adr-NNNN-short-title.md`

## Logs
**Structure:** Context → What I Did → Why → Challenges → Results → Next Steps (with checkboxes)

**Location:** `logs/` with ISO filenames (`daily-YYYY-MM-DD.md`)

**Note:** Keep AI automation markers in HTML comments

## Tutorials
- Step-by-step instructions for repeatable procedures
- Formalized to distinguish from automated scripts or architectural requirements
- Include prerequisites, expected outcomes
- Use numbered steps for procedures
- Location: `tutorials/topic-name.md`

## Device Runs (Knowledge Base)
Use for device onboarding, command output, and observed state.

Minimum structure (single-file per device unless it becomes too large):
- Context (device name, purpose)
- Current bindings (AWS region, endpoints, template, role alias)
- Observed filesystem layout (paths used)
- Known-good commands (copy/paste)
- Failure modes + fixes

Location:
- `mantis-iv-devops-docs/knowledge-base/devices/<device>/` (example: `devices/edge-jetson-demo-01/edge-jetson-demo-01.md`)

## Cloud Current State (Knowledge Base)
Use for AWS account state, resources, and configuration snapshots.

Location:
- `mantis-iv-devops-docs/knowledge-base/AWS/` (folder-per-resource)

---
[« Previous](03-markdown-formatting.md) | [Next »](05-version-control.md)
