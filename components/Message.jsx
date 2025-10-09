import { cls } from "./utils"
import { PERSONAS, getPersonaColor } from "../lib/personas"

export default function Message({ role, children, personaId }) {
  const isUser = role === "user"

  const persona = PERSONAS.find((p) => p.id === personaId) || PERSONAS[0]

  return (
    <div className={cls("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-(persona.color) to-indigo-500 text-lg shadow-sm">
          {persona.icon}
        </div>
      )}
      <div
        className={cls(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          isUser
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800",
        )}
      >
        {children}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
          ME
        </div>
      )}
    </div>
  )
}
