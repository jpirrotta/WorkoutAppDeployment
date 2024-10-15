import { useQuery } from "@tanstack/react-query";

async function fetchUserFavourites(url: string): Promise<String[]> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json() as String[];
        return data;
    } catch (error) {
        console.error('Failed to fetch user favourites:', error);
        throw error;
    }
}


//The userid will be undefined when the user is not signed in so if thats the case, the query will not be enabled
export const useUserFavourites = (userId: string | undefined) => {
    const url = `/api/favourites?userId=${userId}`;
    return useQuery({
        queryKey: ['favourites', userId],
        queryFn: () => fetchUserFavourites(url), enabled: userId != undefined
    });
};