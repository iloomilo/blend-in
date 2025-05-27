export default defineAppConfig({
  ui: {
    colors: {
      primary: "white",
      neutral: "zinc",
    },
    input: {
      slots: {
        base: "!bg-white/10 ring !ring-white/20 placeholder:text-white/50",
        leadingIcon: "!text-white/50",
      }
    },
    select: {
      slots: {
        base: "!bg-white/10 ring !ring-white/20 placeholder:text-white/50",
        trailingIcon: "!text-white/50",
        content: "!bg-white/10 backdrop-blur-lg ring !ring-white/20 !text-white",
      }
    },
    formField: {
      slots: {
        label: '!font-bold uppercase',
        help: "!text-white/60 !mt-1 ",
      }
    },
    button: {
      compoundVariants: [
        {
          variant: 'ghost',
          class: {
            base: 'hover:!bg-white/20 !text-white',
            leadingAvatar: '!bg-white/10'
          }
        }
      ]
    }
  }
});
