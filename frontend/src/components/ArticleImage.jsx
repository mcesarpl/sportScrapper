import { useState } from 'react'

export default function ArticleImage({ url, alt }) {
  const [hasFailed, setHasFailed] = useState(false)

  if (!url || hasFailed) {
    return <div className="image-placeholder">No image</div>
  }

  return <img src={url} alt={alt} loading="lazy" onError={() => setHasFailed(true)} />
}
