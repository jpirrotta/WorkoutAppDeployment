// pages/(user-panel)/_layout.tsx
'use client'

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ContentLayout } from '@/components/user-panel/content-layout';

interface LayoutProps {
    children: ReactNode;
}

const UserPanelLayout = ({ children }: LayoutProps) => {
    const pathname = usePathname()
    const [title, setTitle] = useState('');

    // Define titles based on routes
    const getTitle = (path: string) => {
        if (path.includes('account')) {
            return 'Account Settings';
        } else if (path.includes('bmi')) {
            return 'BMI Calculator';
        } else if (path.includes('calories')) {
            return 'Calories Calculator';
        } else if (path.includes('dashboard')) {
            return 'Dashboard';
        } else if (path.includes('feed')) {
            return 'Feed';
        } else if (path.includes('profile')) {
            return 'Profile';
        } else if (path.includes('workouts')) {
            return 'Workouts';
        }
        return 'User Panel';
    };

    // Update the title whenever the route changes
    useEffect(() => {
        setTitle(getTitle(pathname));
    }, [pathname]);

    return (
        <ContentLayout title={title} className={title === 'Workouts' ? 'px-0' : ''}>
            {children}
        </ ContentLayout>
    );
};

export default UserPanelLayout;
