const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};

export { truncateText };