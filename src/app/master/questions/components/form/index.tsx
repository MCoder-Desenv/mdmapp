"use client"

import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/input'
import { api } from '@/lib/api'

// Define as opções disponíveis para optionValue
const optionValues = ["Inocente", "Coadjuvante", "Aleatorio", "Intencional"] as const;

const schema = z.object({
  questionText: z.string().min(1, "O campo da pergunta é obrigatório"),
  options: z.array(
    z.object({
      optionText: z.string().min(1, "O campo da opção é obrigatório"),
      optionValue: z.enum(optionValues, {
        required_error: "Selecione um valor obrigatório",
      }),
    })
  ).length(4, "É necessário fornecer exatamente 4 opções").refine((data) => {
    const uniqueValues = new Set(data.map(option => option.optionValue))
    return uniqueValues.size === data.length // Verifica se não há valores duplicados
  }, {
    message: "Os valores das opções não podem se repetir",
  })
})

type FormData = z.infer<typeof schema>

export function NewQuestionForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      options: [
        { optionText: "", optionValue: optionValues[0] }, 
        { optionText: "", optionValue: optionValues[1] }, 
        { optionText: "", optionValue: optionValues[2] }, 
        { optionText: "", optionValue: optionValues[3] }
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  async function handleRegisterQuestion(data: FormData) {
    await api.post("/api/questions", {
      questionText: data.questionText,
      options: data.options
    })
    alert("Perguntas cadastradas com sucesso!!");
  }

  return (
    <form className="flex flex-col mt-6" onSubmit={handleSubmit(handleRegisterQuestion)}>
      <label className="mb-1 text-lg font-medium">Pergunta</label>
      <Input
        type="text"
        name="questionText"
        placeholder="Digite a pergunta..."
        error={errors.questionText?.message}
        register={register}
      />

      <label className="mb-1 text-lg font-medium mt-4">Opções (Exatamente 4)</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col mb-2">
          <Input
            type="text"
            name={`options.${index}.optionText`}
            placeholder={`Opção ${index + 1}`}
            error={errors.options?.[index]?.optionText?.message}
            register={register}
          />
          <select
            {...register(`options.${index}.optionValue`)}
            className={`mt-1 border rounded p-2 ${errors.options?.[index]?.optionValue ? 'border-red-500' : ''}`}
          >
            <option value="">Selecione um valor</option>
            {optionValues.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          {errors.options?.[index]?.optionValue && (
            <span className="text-red-500 text-sm">{errors.options[index].optionValue.message}</span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
      >
        Cadastrar Pergunta
      </button>
    </form>
  )
}
