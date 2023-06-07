import { useMediaQuery } from 'react-responsive'

const ResponsiveData = (props) => {
    const is800w = useMediaQuery({ query: '(min-width: 800px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    props.updateResponsiveData(is800w, isPortrait);
}
export default ResponsiveData;
