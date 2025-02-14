import { Search } from "lucide-react"
import Form from "next/form"

const HeaderSearchBox = () => {
  return (
    <Form action="/search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Search className="size-4" strokeWidth={2}/>
        </div>
        <input type="text" name="query" placeholder="Search..." className="w-32 pl-8 pr-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"/>
      </div>
    </Form>
  )
}

export default HeaderSearchBox