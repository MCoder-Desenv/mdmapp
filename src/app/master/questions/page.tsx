import { Questi } from "@/components/questionarioMaster";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link"
import { redirect } from "next/navigation";
import { NewQuestionForm } from './components/form'

export default async function NewCustomer() {

  return (
    <Questi>
      <main className="flex flex-col mt-9 mb-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/customer" className="bg-gray-900 px-4 py-1 text-white rounded">
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">Novo Alunos</h1>
        </div>

        <NewQuestionForm />

      </main>
    </Questi>
  )
}