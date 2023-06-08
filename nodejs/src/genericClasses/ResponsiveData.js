import { useMediaQuery } from 'react-responsive'

const ResponsiveData = (props) => {
    const is800w = useMediaQuery({ query: '(min-width: 800px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    props.updateResponsiveData(is800w, isPortrait, isTabletOrMobile);
}
export default ResponsiveData;
