import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-slate-50 hover:bg-primary/90 dark:bg-primary dark:text-slate-50 dark:hover:bg-primary/90',
                destructive:
                    'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
                outline:
                    'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                outlineDanger:
                    'text-red-500 bg-white hover:bg-slate-100 hover:text-red-600',
                outlinePrimary:
                    'text-primary bg-white hover:bg-slate-100 hover:text-primary',
                secondary:
                    'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
                grey: 'bg-slate-400 text-slate-900 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
                ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
                exportPdf:
                    'bg-red-700 text-slate-50 hover:bg-red-700/80 dark:bg-red-700 dark:text-slate-50 dark:hover:bg-slate-800/80',
                exportExcel:
                    'bg-green-700 text-slate-50 hover:bg-green-700/80 dark:bg-green-700 dark:text-slate-50 dark:hover:bg-slate-800/80',
                redGradient:
                    'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800',
                yellow:
                    'bg-yellow-500 text-slate-50 hover:bg-yellow-600 dark:bg-yellow-700 dark:text-slate-50 dark:hover:bg-yellow-800',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-12 rounded-md px-8',
                icon: 'h-10 w-10',
                block: 'w-full h-12 px-6',
            },
            isLoading: {
                true: 'cursor-wait opacity-80 dark:opacity-70 dark:cursor-wait dark:opacity-80 dark:cursor-wait',
            },
            isActive: {
                true: 'bg-slate-200 dark:bg-slate-800',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading,
            loadingText = 'Loading...',
            isActive,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        className,
                        isLoading,
                        isActive,
                    }),
                )}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span className="animate-spin mr-2">
                            <Loader className="h-5 w-5  animate-spin " />
                        </span>
                        {loadingText}
                    </>
                ) : (
                    props.children
                )}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
