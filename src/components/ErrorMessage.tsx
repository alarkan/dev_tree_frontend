const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="bg-red-50 text-red-600 p-3 text-center text-sm font-bold">{children}</p>
    )
}

export default ErrorMessage