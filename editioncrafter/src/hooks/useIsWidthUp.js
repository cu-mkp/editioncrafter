import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useIsWidthUp = (breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export default useIsWidthUp;
