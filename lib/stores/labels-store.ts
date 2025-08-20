import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Label {
  id: string
  name: string
  color: string
  createdAt: number
}

interface LabelsState {
  labels: Label[]

  // Actions
  createLabel: (name: string, color: string) => string
  updateLabel: (id: string, updates: Partial<Omit<Label, "id" | "createdAt">>) => void
  deleteLabel: (id: string) => void
  getLabelById: (id: string) => Label | undefined
  getLabelsByIds: (ids: string[]) => Label[]
}

const defaultColors = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
]

export const useLabelsStore = create<LabelsState>()(
  persist(
    (set, get) => ({
      labels: [],

      createLabel: (name, color) => {
        const id = crypto.randomUUID()
        const newLabel: Label = {
          id,
          name,
          color,
          createdAt: Date.now(),
        }

        set((state) => ({
          labels: [...state.labels, newLabel],
        }))

        return id
      },

      updateLabel: (id, updates) => {
        set((state) => ({
          labels: state.labels.map((label) => (label.id === id ? { ...label, ...updates } : label)),
        }))
      },

      deleteLabel: (id) => {
        set((state) => ({
          labels: state.labels.filter((label) => label.id !== id),
        }))
      },

      getLabelById: (id) => {
        return get().labels.find((label) => label.id === id)
      },

      getLabelsByIds: (ids) => {
        const { labels } = get()
        return ids.map((id) => labels.find((label) => label.id === id)).filter(Boolean) as Label[]
      },
    }),
    {
      name: "smart-notes-labels-storage",
    },
  ),
)

export { defaultColors }
