import { useCallback, useState } from 'react'
import { getBase64 } from '../actions/getBase64'

export function FileInput({ name, errors, register }: any) {
  const { onChange, ref } = register(name)
  const [image, setImage] = useState<string>()

  const onAvatarChange = useCallback(async (event) => {
    if (event.target.files?.[0]) {
      const base64 = (await getBase64(event.target.files[0])) as string

      setImage(base64)
      onChange(event)
    }
  }, [])

  return (
    <div>
      {image && <img src={image} width="100px" alt="uploaded" />}
      <input type="file" name={name} ref={ref} onChange={onAvatarChange} />
      <p>{errors[name]?.message}</p>
    </div>
  )
}
