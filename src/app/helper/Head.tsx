import React from 'react'

const Head = (props: any) => {
    React.useEffect(() => {
        document.title = `OGES` + props.title;
        document.querySelector("meta[name='description']")?.setAttribute('content', props.description || '');
    }, [props]);

    return (
      <></>
    )
}

export default Head