
interface Media {
  name: string
  blob: Promise<Blob>
  dataUrl: string
}

export default Media;
