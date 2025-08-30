import { useState, useCallback } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/Utils/api";
import { useAuthStore } from "@/Stores/authStore";

interface Inquiry {
  id: number;
  title: string;
  description: string;
  isAnonymous: boolean;
  userId?: number;
  status: "Pending" | "In Progress" | "Completed" | "Rejected" | "Pinned";
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  netLikes: number;
  authorName?: string;
  userLikeStatus?: "like" | "dislike" | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

interface InquiriesResponse {
  inquiries: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
  nextCursor?: string;
}

interface CreateInquiryData {
  title: string;
  description: string;
  isAnonymous: boolean;
}

interface UpdateInquiryData {
  title: string;
  description: string;
  isAnonymous: boolean;
  status?: string;
}

export const useInquiry = () => {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const getAllInquiries = useCallback(
    async (params?: {
      limit?: number;
      page?: number;
      status?: string;
      search?: string;
      userId?: number;
    }) => {
      setIsLoading(true);
      try {
        const searchParams = new URLSearchParams();

        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.status) searchParams.append("status", params.status);
        if (params?.search) searchParams.append("search", params.search);
        if (params?.userId)
          searchParams.append("userId", params.userId.toString());

        const queryString = searchParams.toString();
        const url = queryString ? `/inquiry?${queryString}` : "/inquiry";

        const response = await api.get<InquiriesResponse>(url);

        return response;
      } catch (error) {
        toast.error("Failed to fetch inquiries");
        return { inquiries: [], total: 0, page: 1, totalPages: 0 };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getInquiry = useCallback(async (id: number, userId?: number) => {
    setIsLoading(true);
    try {
      const params = userId ? `?userId=${userId}` : "";
      const response = await api.get<{ inquiry: Inquiry }>(
        `/inquiry/${id}${params}`
      );
      return (response as any).inquiry;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        toast.error("Inquiry not found");
      } else {
        toast.error("Failed to fetch inquiry");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInquiry = useCallback(
    async (data: CreateInquiryData) => {
      setIsLoading(true);
      try {
        toast.loading("Creating inquiry...");

        const response = await api.post<{ message: string; inquiry: Inquiry }>(
          "/inquiry",
          data,
          accessToken || undefined
        );

        toast.dismiss();
        toast.success("Inquiry created successfully!");

        return (response as any).inquiry;
      } catch (error) {
        toast.dismiss();

        if (error instanceof ApiError) {
          switch (error.status) {
            case 400:
              toast.error("Please check your input data");
              break;
            case 401:
              toast.error("You must be logged in to create inquiries");
              break;
            case 403:
              toast.error("You do not have permission to create inquiries");
              break;
            default:
              toast.error(error.message || "Failed to create inquiry");
          }
        } else {
          toast.error("Something went wrong. Please try again");
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const updateInquiry = useCallback(
    async (id: number, data: UpdateInquiryData) => {
      setIsLoading(true);
      try {
        toast.loading("Updating inquiry...");

        const response = await api.put<{ message: string; inquiry: Inquiry }>(
          `/inquiry/${id}`,
          data,
          accessToken || undefined
        );

        toast.dismiss();
        toast.success("Inquiry updated successfully!");

        const updatedInquiry = (response as any).inquiry;

        return updatedInquiry;
      } catch (error) {
        toast.dismiss();

        if (error instanceof ApiError) {
          switch (error.status) {
            case 400:
              toast.error("Please check your input data");
              break;
            case 401:
              toast.error("You must be logged in to update inquiries");
              break;
            case 403:
              toast.error("You do not have permission to update this inquiry");
              break;
            case 404:
              toast.error("Inquiry not found");
              break;
            default:
              toast.error(error.message || "Failed to update inquiry");
          }
        } else {
          toast.error("Something went wrong. Please try again");
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const deleteInquiry = useCallback(
    async (id: number) => {
      setIsLoading(true);
      try {
        toast.loading("Deleting inquiry...");

        await api.delete(`/inquiry/${id}`, accessToken || undefined);

        toast.dismiss();
        toast.success("Inquiry deleted successfully!");

        return true;
      } catch (error) {
        toast.dismiss();

        if (error instanceof ApiError) {
          switch (error.status) {
            case 401:
              toast.error("You must be logged in to delete inquiries");
              break;
            case 403:
              toast.error("You do not have permission to delete this inquiry");
              break;
            case 404:
              toast.error("Inquiry not found");
              break;
            default:
              toast.error(error.message || "Failed to delete inquiry");
          }
        } else {
          toast.error("Something went wrong. Please try again");
        }

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const toggleLike = useCallback(
    async (id: number, isLike: boolean) => {
      setIsLoading(true);
      try {
        const response = await api.post<{
          message: string;
          likeCount: number;
          dislikeCount: number;
          netLikes: number;
        }>(`/inquiry/${id}/like`, { isLike }, accessToken || undefined);

        toast.success(
          isLike
            ? "Inquiry liked successfully!"
            : "Inquiry disliked successfully!"
        );

        return response;
      } catch (error) {
        if (error instanceof ApiError) {
          switch (error.status) {
            case 401:
              toast.error("You must be logged in to like/dislike inquiries");
              break;
            case 404:
              toast.error("Inquiry not found");
              break;
            default:
              toast.error(error.message || "Failed to toggle like");
          }
        } else {
          toast.error("Something went wrong. Please try again");
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const getTopLikedInquiries = useCallback(async (limit: number = 3) => {
    setIsLoading(true);
    try {
      const response = await api.get<{ inquiries: Inquiry[] }>(
        `/inquiry/top-liked?limit=${limit}`
      );

      return (response as any).inquiries as Inquiry[];
    } catch (error) {
      return [] as Inquiry[];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    getAllInquiries,
    getInquiry,
    createInquiry,
    updateInquiry,
    deleteInquiry,
    toggleLike,
    getTopLikedInquiries,
  };
};
