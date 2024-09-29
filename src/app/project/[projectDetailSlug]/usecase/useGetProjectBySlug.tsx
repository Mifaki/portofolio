import { getProjectBySlug } from '@/shared/actions/projectService';
import { IGeneralMockFetchResponse } from '@/models/generalinterfaces';
import { IProject } from '@/models/projectinterfaces';

export async function useGetProjectBySlug(slug: string): Promise<IGeneralMockFetchResponse<IProject>> {
    try {
        const response: IGeneralMockFetchResponse<IProject | null> = await getProjectBySlug(slug);
        if (response.status) {
            return { 
                data: response.data,
                message: response.message, 
                status: response.status 
            };
        } else {
            return { 
                data: response.data, 
                message: response.message, 
                status: response.status 
            };
        }
    } catch (err) {
        return { 
            data: null, 
            message: 'An error occurred while fetching the project', 
            status: false 
        };
    }
}