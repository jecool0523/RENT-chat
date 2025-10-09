"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { PERSONAS, getPersonaColor } from "../lib/personas"
import { cls } from "./utils"

export default function PersonaSelector({ selectedPersonaId, onSelectPersona }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cls(
          "flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors touch-manipulation",
          "hover:bg-white active:bg-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
          "border-zinc-200 dark:border-zinc-800",
          "bg-white dark:bg-zinc-900",
        )}
      >
        <span className="text-lg sm:text-xl">{selectedPersona.icon}</span>
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium truncate">{selectedPersona.name}</div>
          <div className="text-zinc-500 dark:text-zinc-400 truncate text-xs">{selectedPersona.description}</div>
        </div>
        <ChevronDown className={cls("h-4 w-4 transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cls(
              "absolute left-0 top-full z-50 mt-2 w-full rounded-xl border shadow-lg",
              "bg-white dark:bg-zinc-900",
              "border-zinc-200 dark:border-zinc-800",
            )}
          >
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-2">
              {PERSONAS.map((persona) => {
                const isSelected = persona.id === selectedPersonaId
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona.id)
                      setIsOpen(false)
                    }}
                    className={cls(
                      "w-full rounded-lg p-3 text-left transition-colors touch-manipulation",
                      "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:active:bg-zinc-800",
                      isSelected && "bg-zinc-100 dark:bg-zinc-800",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl sm:text-2xl">{persona.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{persona.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {persona.description}
                        </p>
                        {persona.source && (
                          <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-500 italic truncate">
                            출처: {persona.source}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {persona.traits.map((trait) => (
                            <span
                              key={trait}
                              className={cls(
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]",
                                getPersonaColor(persona.color),
                              )}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
