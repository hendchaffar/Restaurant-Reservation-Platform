import { FaCamera } from "react-icons/fa";
import placeholder from "../assets/images.png";

const ImagePreview=(props:{
    previewUrl:string,
    handleFileUpload:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    readonly:boolean
})=>{
    const {  previewUrl,handleFileUpload,readonly } = props;

    return (
        <div className="flex justify-center">
        <div className="relative group w-32 h-32 rounded-full  overflow-hidden mb-4">
          <img
            className="w-full h-full object-cover"
            alt="Avatar"
            src={ previewUrl || placeholder }
          />
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <FaCamera className="w-12 h-12 text-white" />
          </label>
          { !readonly && (
              <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          )}
        
        </div>
      </div>
    )
}

export default ImagePreview;