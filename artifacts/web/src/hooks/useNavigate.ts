import { useLocation } from "wouter";
import { slugify } from "@/data/mockData";

export function useNavigate() {
  const [, navigate] = useLocation();

  const goToPost = (query: string) => {
    navigate("/" + slugify(query));
  };

  return { goToPost };
}
