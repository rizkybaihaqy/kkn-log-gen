import { useState } from "react"
import { useController } from "react-hook-form"

export const FileInput = ({ control, name }: any) => {
  const { field } = useController({ control, name })
  const [value, setValue] = useState('')
  return (
    <>
      <input
        type="file"
        value={value}
        onChange={async (e) => {
          setValue(e.target.value)

          if (!e.target.files) return
          const file = e.target.files[0]
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(file)
          })

          field.onChange(base64)
        }}
      />
    </>
  )
}
