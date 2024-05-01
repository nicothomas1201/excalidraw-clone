import { create } from 'zustand'

type ToolsStore = {
  currentTool: string
  setCurrentTool: (tool: string) => void
}

export const useToolsStore = create<ToolsStore>((set) => ({
  currentTool: 'rectangle',
  setCurrentTool: (tool) => set({ currentTool: tool }),
}))
