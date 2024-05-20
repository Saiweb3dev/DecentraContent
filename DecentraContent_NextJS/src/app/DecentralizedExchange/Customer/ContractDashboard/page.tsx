import InitialFileLocation from "@/components/Contract_Components/CustomerOnlyFunctions/File_Initialization/FI_Main_InitialFileLocation";
import InitializeContract from "@/components/Contract_Components/Token_Initialization/TI_Main_InitializeToken";

function page() {
  return (
    <div>
      <InitializeContract />
      <InitialFileLocation/>
    </div>
  );
}

export default page;
