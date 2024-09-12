import { IconType } from '@icons-pack/react-simple-icons';

type StyledIconProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | IconType;
  w?: string;
  [key: string]: any;
};
// the default style of the icons below is defied in this component
export const StyledIcon: React.FC<StyledIconProps> = ({
  Icon,
  w = '80%',
  ...props
}) => {
  return <Icon width={w} {...props} />;
};
