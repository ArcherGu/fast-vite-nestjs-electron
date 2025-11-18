<script setup lang="ts">
import { ref } from 'vue'

const { sendMsg: sendMsgToMainProcess, onReplyMsg } = window.electron

const log = ref('')
const msg = ref('')
const isSending = ref(false)

async function sendMsg() {
  if (!msg.value.trim() || isSending.value)
    return

  try {
    isSending.value = true
    log.value += `[render]: ${msg.value}\n`
    const data = await sendMsgToMainProcess(msg.value)
    log.value += `[main]: ${data}\n`
    msg.value = ''

    // Auto scroll to bottom
    const textarea = document.querySelector('.log-output') as HTMLTextAreaElement
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight
    }
  }
  catch (error) {
    console.error(error)
    log.value += `[error]: ${error}\n`
  }
  finally {
    isSending.value = false
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMsg()
  }
}

onReplyMsg((msg: string) => {
  log.value += `[main]: ${msg}\n`
  const textarea = document.querySelector('.log-output') as HTMLTextAreaElement
  if (textarea) {
    textarea.scrollTop = textarea.scrollHeight
  }
})
</script>

<template>
  <div class="hello-world">
    <div class="card">
      <div class="card-body">
        <div class="log-section">
          <label class="label">Message Log</label>
          <textarea v-model="log" class="log-output" placeholder="Message logs will appear here..." readonly />
          <div class="log-actions">
            <p class="card-description">
              Communicate with the main process
            </p>
            <button class="btn btn-secondary btn-sm" :disabled="!log" @click="log = ''">
              Clear Log
            </button>
          </div>
        </div>

        <div class="input-section">
          <label class="label">Send Message</label>
          <div class="input-group">
            <input
              v-model="msg" type="text" class="input" placeholder="Enter message to send to main process..."
              :disabled="isSending" @keypress="handleKeyPress"
            >
            <button class="btn btn-primary" :disabled="!msg.trim() || isSending" @click="sendMsg">
              <span v-if="!isSending">Send</span>
              <span v-else>Sending...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hello-world {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 400;
  margin: 0;
}

.card-body {
  padding: 2rem;
}

.log-section {
  margin-bottom: 2rem;
}

.input-section {
  margin-top: 2rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.log-output {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
  background: #f8fafc;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  resize: vertical;
  transition: all 0.2s ease;
  outline: none;
}

.log-output:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.log-output::placeholder {
  color: #94a3b8;
}

.log-actions {
  margin-top: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.input {
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.input::placeholder {
  color: #94a3b8;
}

.btn {
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-hover) 0%, #7c3aed 100%);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }

  .log-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .input-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
