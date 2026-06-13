/* ==========================================================================
   Gilchrist Research - Interactive Logic
   ========================================================================== */

// Mock Database for Security Advisories
const ADVISORIES_DATA = {
    "g-2026-081": {
        id: "G-2026-081",
        category: "Smart Contracts",
        title: "EVM Liquidity Pool Router Reentrancy",
        severity: "Critical",
        severityClass: "badge-critical",
        description: "A vulnerability was discovered in the pool routing engine where token transfers triggered user-defined callbacks before correcting state balances. Under specific race conditions, this allowed multiple token withdrawals in a single block transaction.",
        file: "DEXRouter.sol",
        code: `<span class="diff-line-del">-  uint256 balance = tokenBalances[msg.sender];</span>
<span class="diff-line-del">-  require(token.transfer(msg.sender, balance), "Transfer failed");</span>
<span class="diff-line-del">-  tokenBalances[msg.sender] = 0;</span>
<span class="diff-line-add">+  uint256 balance = tokenBalances[msg.sender];</span>
<span class="diff-line-add">+  tokenBalances[msg.sender] = 0;</span>
<span class="diff-line-add">+  require(token.transfer(msg.sender, balance), "Transfer failed");</span>`
    },
    "g-2026-079": {
        id: "G-2026-079",
        category: "Solana Labs",
        title: "Solana Account Validation Bypass",
        severity: "High",
        severityClass: "badge-high",
        description: "An account ownership verification step was omitted during instruction deserialization, letting an attacker submit a spoofed sysvar account and bypass validation checks.",
        file: "instruction.rs",
        code: `<span class="diff-line-del">-  let info_sysvar = next_account_info(account_info_iter)?;</span>
<span class="diff-line-del">-  // Verification omitted</span>
<span class="diff-line-add">+  let info_sysvar = next_account_info(account_info_iter)?;</span>
<span class="diff-line-add">+  if info_sysvar.key != &sysvar::instructions::id() {</span>
<span class="diff-line-add">+      return Err(ProgramError::InvalidArgument.into());</span>
<span class="diff-line-add">+  }</span>`
    },
    "g-2026-075": {
        id: "G-2026-075",
        category: "AI Infrastructure",
        title: "AI Gateway Semantic Policy Bypass",
        severity: "Medium",
        severityClass: "badge-medium",
        description: "Custom prompt delimiters and multi-lingual encoding allowed prompts to bypass semantic safety guardrails on target large language models.",
        file: "gateway_policy.py",
        code: `<span class="diff-line-del">-  def check_policy(prompt: str) -> bool:</span>
<span class="diff-line-del">-      return evaluate_safety(prompt)</span>
<span class="diff-line-add">+  def check_policy(prompt: str) -> bool:</span>
<span class="diff-line-add">+      decoded_prompt = normalize_unicode_and_encoding(prompt)</span>
<span class="diff-line-add">+      return evaluate_safety(decoded_prompt)</span>`
    }
};

// Global variables for live telemetry
let monitoredContractsCount = 14280;
let securedValueAmount = 1843291048; // $1.84B representation
let preemptedThreatsCount = 342;

document.addEventListener("DOMContentLoaded", () => {
    initAdvisories();
    initTelemetry();
    initContactForm();
    initSmoothScroll();
});

/**
 * Initialize Interactive Advisory Selector
 */
function initAdvisories() {
    const navButtons = document.querySelectorAll(".advisory-row");
    
    // Elements to update
    const detailId = document.getElementById("detail-id");
    const detailCategory = document.getElementById("detail-category");
    const detailTitle = document.getElementById("detail-title");
    const detailSeverity = document.getElementById("detail-severity");
    const detailDesc = document.getElementById("detail-description");
    const diffFile = document.getElementById("diff-file");
    const diffCode = document.getElementById("diff-code");
    
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const advId = button.getAttribute("data-id");
            const data = ADVISORIES_DATA[advId];
            
            if (!data) return;
            
            // Toggle active class on rows
            navButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            // Update details
            detailId.textContent = data.id;
            detailCategory.textContent = data.category;
            detailTitle.textContent = data.title;
            detailDesc.textContent = data.description;
            diffFile.textContent = data.file;
            diffCode.innerHTML = data.code;
            
            // Handle severity badge class updates
            detailSeverity.textContent = data.severity;
            detailSeverity.className = `adv-badge ${data.severityClass}`;
        });
    });
}

/**
 * Initialize Real-time Telemetry Updates
 */
function initTelemetry() {
    const contractsEl = document.getElementById("val-contracts");
    const assetsEl = document.getElementById("val-assets");
    const vulnerabilitiesEl = document.getElementById("val-vulnerabilities");
    
    if (!contractsEl || !assetsEl || !vulnerabilitiesEl) return;
    
    // Increment Monitored Contracts
    setInterval(() => {
        if (Math.random() > 0.4) {
            monitoredContractsCount += Math.floor(Math.random() * 2) + 1;
            contractsEl.textContent = monitoredContractsCount.toLocaleString();
        }
    }, 4500);
    
    // Increment Secured Assets ($ value)
    setInterval(() => {
        const increment = Math.floor(Math.random() * 28000) + 12000; // $12k to $40k
        securedValueAmount += increment;
        
        // Convert to human-readable format ($1.84B style with precise details)
        const billions = (securedValueAmount / 1000000000).toFixed(6);
        assetsEl.textContent = `$${billions.substring(0, 4)}B`;
    }, 3000);
    
    // Increment Preempted Threats
    setInterval(() => {
        if (Math.random() > 0.92) { // Rare event
            preemptedThreatsCount += 1;
            vulnerabilitiesEl.textContent = preemptedThreatsCount.toString();
            triggerPulseAlert();
        }
    }, 12000);
}

/**
 * Trigger a brief pulse animation on the threat count card to indicate live update
 */
function triggerPulseAlert() {
    const vulnCard = document.getElementById("stat-vulnerabilities");
    if (!vulnCard) return;
    
    vulnCard.style.transition = "all 0.15s ease";
    vulnCard.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.15)";
    vulnCard.style.borderColor = "var(--color-mint)";
    
    setTimeout(() => {
        vulnCard.style.boxShadow = "var(--shadow-md)";
        vulnCard.style.borderColor = "rgba(0,0,0,0.05)";
    }, 1000);
}

/**
 * Initialize Contact Form Submission & Feedback
 */
function initContactForm() {
    const form = document.getElementById("audit-form");
    const feedback = document.getElementById("form-feedback-message");
    const submitBtn = document.getElementById("form-submit");
    
    if (!form || !feedback || !submitBtn) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById("form-name").value.trim();
        
        // Visual sending state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Processing Request...</span>`;
        
        setTimeout(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Set and show feedback message
            feedback.textContent = `Thank you, ${nameVal}. Your research audit request has been logged. Our systems have dispatched an agent, and our lab directors will contact you within 24 hours.`;
            feedback.className = "form-feedback success";
            
            // Reset form fields
            form.reset();
            
            // Hide feedback after 8 seconds
            setTimeout(() => {
                feedback.className = "form-feedback";
                feedback.textContent = "";
            }, 8000);
            
        }, 1500);
    });
}

/**
 * Initialize Smooth Scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}
