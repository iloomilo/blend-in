export const useHideMode = () => {
    const state = useState<boolean>('hideMode', () => false)
  
    const hideMode = computed({
      get: () => state.value,
      set: (val: boolean) => (state.value = val)
    })
  
    const toggle = () => {
      hideMode.value = !hideMode.value
    }
  
    return { hideMode, toggle }
  }
  