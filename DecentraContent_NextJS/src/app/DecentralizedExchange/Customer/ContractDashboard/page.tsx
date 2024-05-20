import InitialFileLocation from "@/components/Contract_Components/CustomerOnlyFunctions/File_Initialization/FI_Main_InitialFileLocation";
import FilePreview from "@/components/Contract_Components/CustomerOnlyFunctions/File_Preview/FP_FilePreview";
import InitializeContract from "@/components/Contract_Components/Token_Initialization/TI_Main_InitializeToken";

function page() {
  return (
    <div>
      <InitializeContract />
      <InitialFileLocation/>
      <FilePreview/>
    </div>
  );
}

export default page;
