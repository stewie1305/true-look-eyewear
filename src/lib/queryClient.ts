import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //Cofig mac dinh cho tat ca query

      //1.Refresh data moi
      refetchOnWindowFocus: false,
      //mac dinh la true(tu fetch lai khi user quay lai tab)
      //hoc: tat de debug (log do nhay loan)
      //Production: bat lai de data luon tuoi

      //2. Retry Failed Requests
      retry: 1,
      //Mac dinh la 3
      //Hoc: giam xuong 1 de nhanh thay loi
      //Production: 2-3 la hop ly

      //3.Stale time: tgian ma data dc xem la moi
      staleTime: 1000 * 60 * 0,
      //mac dinh la 0 (data ngay lap tuc cu) data cu la data kh dung dc nx
      //Production: 30s-5p tuy data

      //4. Cache time (GC time)
      gcTime: 5 * 60 * 1000,
      //mac dinh la 5p
      //Cache ton tai 5p ke tu khi kh con component nao dung no nx
    },
  },
});
