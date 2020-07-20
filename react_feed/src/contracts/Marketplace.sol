pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public patCount = 1000;
    uint public AppCount=0;
    mapping(uint => Patient) public patients;
    mapping(uint=>Appointments) public apps;
// id,name,username,pass,email,blood,address,filehash
    struct Patient {
        uint id;
        string name;
        string email;
        string blood;
        string addr;
        address payable patacc;
        string pri;
    }
    struct Appointments
    {   uint patid;
        uint docid;
        string patname;
        string blood;
        string addr;
        address patadd;
        address docadd;
        bool status;


    }
    struct report
    {
        uint patid;
        uint docid;
        string docname;
        string repname;
        string hash;
    }
    struct prescription {
        uint patidp;
        uint docidp;
        string docnamep;
        string filenamep;
        string datep;
        string hashp;
    }
    mapping(uint=>prescription) public prescriptions;
    uint public preCount=0;
     mapping(uint=>report) public reports;
     uint public repCount=0;
event PatientCreated(
    uint id,
        string name,
        string email,
        string blood,
        string addr,
        address payable patacc,
        string patpri
);
uint public docCount = 0;
string public patientname;
    mapping(uint=> doctor) public doctors;
    
    struct doctor {
        uint id;
        string name;
        string spec;
        string email;
        string addr;
        string filehash;
        address payable docacc;
        string pri;
    

    }
    event DoctorCreated(
        uint id,
        string name,
        string spec,
        string email,
        string addr,
        string filehash,
        address payable docacc,
        string pri
        

    );
    function createDoctor(uint _id,string memory _name,string memory spec,string memory _blood,string memory _addr,string memory _hash,address payable _docacc,string memory pri) public {
        docCount++;
        doctors[docCount] = doctor(_id,_name,spec,_blood,_addr,_hash,_docacc,pri);
        emit DoctorCreated(_id,_name,spec,_blood,_addr,_hash,_docacc,pri);
    }
event bookAppointment(
    uint patid,
    uint docid,
    string name1,
    string name2,
    address payable patient,
    address payable doctor
    //bool purchased
);
event searched(
    string name,
    address ad

);
    constructor() public {
        name = "Medical records";
    }
function createPatient(string memory _name,string memory _mail,string memory _blood,string memory _addr, address payable _patacc,string memory patpri) public {
    // Require a valid name
    require(bytes(_name).length > 0);
    // Require a valid price
    //require(_age > 0);
    // Increment product count
    ++patCount;
    // Create the product
    patients[patCount] = Patient(patCount,_name,_mail,_blood,_addr,_patacc,patpri);
    // Trigger an event
    emit PatientCreated(patCount,_name,_mail,_blood,_addr,_patacc,patpri);
}



function bookAppointments(uint pat_id, uint doc_id2) public payable {
    // Fetch the patient amd doctor
    Patient memory _patient=patients[pat_id];
    doctor memory _doctor=doctors[doc_id2];
    // Fetch the patient
    /*for(uint i=0;i<patCount;i++)
    {
        if(patients[i].id==_id)
        _patient = patients[i];
    }
    for(uint i=0;i<docCount;i++)
    {
        if(doctors[i].id==_id2)
        _doctor = doctors[i];
    }*/
    //address payable _seller = msg.sender;
    address payable _doctor1=_doctor.docacc;
    // Make sure the product has a valid id
    require(_patient.id > 0 && _patient.id <= patCount);
    //storing Appointment Details
    AppCount++;
    apps[AppCount].patid=pat_id;
    apps[AppCount].docid=doc_id2;
    apps[AppCount].patname=_patient.name;
    apps[AppCount].blood=_patient.blood;
    apps[AppCount].addr=_patient.addr;
    apps[AppCount].patadd=_patient.patacc;
    apps[AppCount].docadd=_doctor.docacc;
    apps[AppCount].status=false;
    address(_doctor1).transfer(msg.value);
    // Trigger an event
    emit bookAppointment(_patient.id, _doctor.id,_patient.name,_doctor.name, _patient.patacc, _doctor.docacc);
}
function searchPatient(address payable _patient) public
{
    for( uint i=0;i<patCount;i++)
    {
        if(patients[i].patacc==_patient) {
        patientname=patients[i].name;
//emit searched(patients[i].name,patients[i].patacc);
        }
        
    }
}


function ApproveAppointment(address patadd,address docadd) public
{
for(uint i=0;i<=AppCount;i++)
{
    if(patadd==apps[i].patadd)
    {
        apps[i].status=true;
    }

}
}


function UploadReports(uint patid, uint docid,string memory docname, string memory name,string memory _hash) public
{

repCount++;
report memory _uploaded=report(patid,docid,docname,name,_hash);
reports[repCount]=_uploaded;
}

function uploadPrescription(uint patidp,uint doc_id,string memory dname,string memory filename,string memory presci,string memory filehash) public
{
    preCount++;
    prescription memory pre=prescription(patidp,doc_id,dname,filename,presci,filehash);
    prescriptions[preCount]=pre;
}




}