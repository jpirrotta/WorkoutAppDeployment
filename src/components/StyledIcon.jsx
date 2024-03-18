// the default style of the icons below is defied in this component
export const StyledIcon = ({ Icon, w='80%', ...props }) => {
    return <Icon width={w}  {...props} />;
  };