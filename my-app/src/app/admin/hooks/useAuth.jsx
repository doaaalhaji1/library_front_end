import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(role) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== role) {
      router.push("/books"); // توجيه غير المصرح لهم
    } else {
      setLoading(false);
    }
  }, [router, role]);

  return loading;
}