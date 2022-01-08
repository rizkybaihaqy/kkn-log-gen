import { useState } from 'react'
import {
  SubmitHandler,
  useController,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { getDayByNum } from './getDay'
import { print } from './toPDF'
import { Activities, Inputs } from './type'

export function Form() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      activities: [{ timeStart: '', timeEnd: '', name: '', detail: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'activities' // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let newActivity: Activities[] = []

    data.activities.forEach(async (activity) => {
      const time = activity.timeStart + '-' + activity.timeEnd

      newActivity.push({
        name: activity.name,
        time,
        detail: activity.detail,
        documentation: activity.documentation
      })
    })

    const date = getDayByNum(+data.dayCount)

    print({
      dayCount: data.dayCount,
      day: date.toLocaleDateString('id', { weekday: 'long' }),
      date: date.toLocaleDateString('id', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      activities: newActivity,
      name: data.name,
      city: data.city,
      signature: data.signature
    })
  }

  const FileInput = ({ control, name }: any) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          placeholder="name"
          {...register('name', { required: true })}
        />
        <input
          type="text"
          placeholder="city"
          {...register('city', { required: true })}
        />
        <FileInput name="signature" control={control} />
      </div>
      <hr />

      <div>
        <input
          type="number"
          placeholder="Day"
          {...register('dayCount', {
            required: true,
            max: 45,
            min: 1,
            maxLength: 2
          })}
        />
        {errors.dayCount && <span>Activities only up to 45 days</span>}
      </div>
      <hr />

      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              type="time"
              placeholder="Activity time"
              {...register(`activities.${index}.timeStart`, { required: true })}
            />
            <input
              type="time"
              placeholder="Activity time"
              {...register(`activities.${index}.timeEnd`, { required: true })}
            />
            <input
              type="text"
              placeholder="Activity"
              {...register(`activities.${index}.name`, { required: true })}
            />
            <textarea
              {...register(`activities.${index}.detail`, { required: true })}
            />
            <FileInput
              name={`activities.${index}.documentation`}
              control={control}
            />
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
            <hr />
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            append({ timeStart: '', timeEnd: '', name: '', detail: '' })
          }}>
          Add activity
        </button>
      </div>
      <input type="submit" />
    </form>
  )
}
