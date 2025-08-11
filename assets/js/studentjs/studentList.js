const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var htmlProfile = '<tr id="unread"><td><img class="rounded-full max-w-10" style="width: 40px" src="{profileurl}" alt="activity-user"/></td><td><h6 class="mb-1">{studentName}</h6><p class="m-0">{studentMobile}</p></td><td><h6 class="text-muted"><i class="fas fa-circle text-success text-[10px] ltr:mr-4 rtl:ml-4"/>{batchName}</h6></td><td><a href="{profileLink}" class="badge bg-theme-bg-1 text-white text-[12px]">View Profile</a></td></tr>';
if(urlParams.has('listName'))
{
    if(urlParams.get("listName")=="totalstudent")
    {
       
    }
}