import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">회원가입이 완료되었습니다!</CardTitle>
            <CardDescription>이메일을 확인해주세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              회원가입이 성공적으로 완료되었습니다. 로그인하기 전에 이메일을 확인하여 계정을 인증해주세요.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">로그인 페이지로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
