import { useState } from 'react'
import {
  SubmitHandler,
  useController,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { getBase64 } from '../actions/getBase64'
import { getDateByDay } from '../actions/getDay'
import { print } from '../actions/toPDF'
import { Activities, Inputs } from '../type'
import { FileInput } from './FileInput'

export function Form() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
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

    await Promise.all(
      data.activities.map(async (activity, i) => {
        const time = activity.timeStart + '-' + activity.timeEnd
        const base64 = await getBase64(activity.documentation[0])

        newActivity.push({
          name: activity.name,
          detail: activity.detail,
          time,
          documentation: base64
        })
      })
    )

    const date = getDateByDay(+data.dayCount)
    const signature64 = await getBase64(data.signature[0])

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
      signature: signature64
    })
  }

  // const FileInput = ({ control, name }: any) => {
  //   const { field } = useController({ control, name })
  //   const [val, setVal] = useState('')
  //   const [image, setImage] = useState<string>()

  //   return (
  //     <>
  //       {image && <img src={image} width="100px" alt='uploaded' />}
  //       <input
  //         type="file"
  //         value={val}
  //         onChange={async (e) => {
  //           setVal(e.target.value)

  //           if (!e.target.files) return
  //           const base64 = await getBase64(e.target.files[0]) as string

  //           console.log(name, base64)

  //           setImage(base64)
  //           field.onChange(base64)
  //         }}
  //       />
  //     </>
  //   )
  // }

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
        <FileInput name="signature" errors={errors} register={register} />
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
              errors={errors}
              register={register}
            />
            {/* <FileInput
              name={`activities.${index}.documentation`}
              control={control}
            /> */}
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
