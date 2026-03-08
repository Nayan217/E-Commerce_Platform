import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabase-api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => supabaseApi.getWishlist(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const toggle = useMutation({
    mutationFn: (productId: string) => supabaseApi.toggleWishlist(user!.id, productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist', user?.id] });
      const prev = queryClient.getQueryData<string[]>(['wishlist', user?.id]) || [];
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      queryClient.setQueryData(['wishlist', user?.id], next);
      return { prev };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(['wishlist', user?.id], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
    },
  });

  const toggleWishlist = (productId: string) => {
    if (!user) {
      toast({ title: 'Please log in to use wishlist', variant: 'destructive' });
      return;
    }
    const wasWishlisted = wishlist.includes(productId);
    toggle.mutate(productId);
    toast({ title: wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥' });
  };

  return {
    wishlist,
    isWishlisted: (productId: string) => wishlist.includes(productId),
    toggleWishlist,
  };
}
