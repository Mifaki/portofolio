'use client';

import { Button } from "../ui/button";


const CustomErrorBoundary = ({ error }: { error: any }) => {
    return (
        <div className="bg-red-100 rounded-lg py-5">
            <div className="flex flex-col text-ny-error-500 text-center gap-[20px] justify-center items-center min-h-[50vh]">
                <div>
                    <div className="text-[30px] font-bold">Something went wrong!</div>
                    <div className="text-[18px] font-regular">{error.message}</div>
                </div>
                <Button
                    className="max-w-max h-[40px]"
                    onClick={() => window.location.reload()}
                    variant={'outline'}
                    >
                    Reload
                </Button>
            </div>
        </div>
    );
};

export default CustomErrorBoundary;
