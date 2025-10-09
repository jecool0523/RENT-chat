"use client"

import { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Pencil, RefreshCw, Check, X, Square } from "lucide-react"
import Message from "./Message"
import Composer from "./Composer"
import { cls, timeAgo } from "./utils"
import { getPersonaById, getPersonaColor } from "../lib/personas"

function ThinkingMessage({ onPause }) {
  return (
    <Message role="assistant">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
        </div>
        <span className="text-sm text-zinc-500">AI가 생각하고 있습니다...</span>
        <button
          onClick={onPause}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Square className="h-3 w-3" /> 일시정지
        </button>
      </div>
    </Message>
  )
}

const ChatPane = forwardRef(function ChatPane(
  { conversation, onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking, currentPersonaId },
  ref,
) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const composerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  if (!conversation) return null

  const persona = getPersonaById(currentPersonaId || "default")
  const tags = persona.traits

  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:px-8">
        <div className="mb-2 text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight">
          <span className="block leading-[1.05] font-sans text-xl sm:text-2xl">{conversation.title}</span>
        </div>
        <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          {timeAgo(conversation.updatedAt)} 업데이트 · {count}개 메시지
        </div>

        <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3 border-b border-zinc-200 pb-4 sm:pb-5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{persona.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{persona.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{persona.description}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className={cls(
                  "inline-flex items-center rounded-full border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs",
                  getPersonaColor(persona.color),
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-4 sm:p-6 text-xs sm:text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            아직 메시지가 없습니다. 인사를 건네보세요.
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {editingId === m.id ? (
                  <div className={cls("rounded-2xl border p-2", "border-zinc-200 dark:border-zinc-800")}>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-xl bg-transparent p-2 text-sm outline-none touch-manipulation"
                      rows={3}
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-2 text-xs text-white dark:bg-white dark:text-zinc-900 touch-manipulation"
                      >
                        <Check className="h-3.5 w-3.5" /> 저장
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs touch-manipulation"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">저장 후 </span>재전송
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs touch-manipulation"
                      >
                        <X className="h-3.5 w-3.5" /> 취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message role={m.role} personaId={m.role === "assistant" ? m.personaId || currentPersonaId : null}>
                    <div className="whitespace-pre-wrap break-words">{m.content}</div>
                    {m.role === "user" && (
                      <div className="mt-1 flex gap-3 text-[11px] text-zinc-500">
                        <button
                          className="inline-flex items-center gap-1 hover:underline active:text-zinc-700 dark:active:text-zinc-300 touch-manipulation"
                          onClick={() => startEdit(m)}
                        >
                          <Pencil className="h-3.5 w-3.5" /> 수정
                        </button>
                        <button
                          className="inline-flex items-center gap-1 hover:underline active:text-zinc-700 dark:active:text-zinc-300 touch-manipulation"
                          onClick={() => onResendMessage?.(m.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> 재전송
                        </button>
                      </div>
                    )}
                  </Message>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text) => {
          if (!text.trim()) return
          setBusy(true)
          await onSend?.(text)
          setBusy(false)
        }}
        busy={busy}
      />
    </div>
  )
})

export default ChatPane
