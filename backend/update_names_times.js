const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = [
  'Aadhavan', 'Aarav', 'Abhinav', 'Adhitya', 'Ajith', 'Akash', 'Anand', 'Anbu', 'Arun', 'Arvind',
  'Ashwin', 'Balaji', 'Bala', 'Bharath', 'Chandran', 'Chellappa', 'Dhanush', 'Dinesh', 'Elango', 'Ganesh',
  'Gautham', 'Gokul', 'Gopal', 'Hari', 'Ilan', 'Iniyan', 'Jai', 'Jeeva', 'Kamal', 'Karthik',
  'Kavin', 'Kishore', 'Krishna', 'Kumar', 'Madhavan', 'Mani', 'Manoj', 'Mohan', 'Murali', 'Muthu',
  'Nagaraj', 'Nanda', 'Naveen', 'Nitin', 'Parthiban', 'Prakash', 'Prasad', 'Praveen', 'Prem', 'Raghav',
  'Rahul', 'Rajesh', 'Raju', 'Ram', 'Ramesh', 'Ravi', 'Rishi', 'Rohan', 'Sachin', 'Sanjay',
  'Santhosh', 'Saravanan', 'Sathish', 'Selvam', 'Senthil', 'Shiva', 'Siddharth', 'Siva', 'Srinivas', 'Subhash',
  'Sundar', 'Surya', 'Tamil', 'Thirumalai', 'Vasanth', 'Velu', 'Venkatesh', 'Vidyut', 'Vijay', 'Vikram',
  'Vinoth', 'Vishnu', 'Aarthi', 'Abirami', 'Agalya', 'Ahalya', 'Aishwarya', 'Akila', 'Amala', 'Anandhi',
  'Anitha', 'Anjali', 'Anu', 'Aruna', 'Asha', 'Bhavani', 'Bhumika', 'Bindu', 'Brindha', 'Chitra',
  'Deepa', 'Devi', 'Dhivya', 'Durga', 'Ganga', 'Gayathri', 'Geetha', 'Gowri', 'Harini', 'Hema',
  'Indhu', 'Ishwarya', 'Janani', 'Jaya', 'Jeevitha', 'Kala', 'Kalpana', 'Kalyani', 'Kamala', 'Kanmani',
  'Karthika', 'Kavitha', 'Kavya', 'Keerthi', 'Kokila', 'Latha', 'Lavanya', 'Leela', 'Madhu', 'Mahalakshmi',
  'Malathi', 'Manjula', 'Meena', 'Meenakshi', 'Menaka', 'Mohana', 'Monisha', 'Mythili', 'Nadhiya', 'Nalini',
  'Nandhini', 'Nithya', 'Niveditha', 'Oviya', 'Padma', 'Pallavi', 'Pavithra', 'Pooja', 'Poornima', 'Prakruthi',
  'Preethi', 'Priya', 'Priyanka', 'Radha', 'Radhika', 'Rajalakshmi', 'Rajani', 'Ramya', 'Rani', 'Ranjani',
  'Rathi', 'Rekha', 'Renuka', 'Revathi', 'Roopa', 'Roshini', 'Sangeetha', 'Santhi', 'Saranya', 'Saraswathi',
  'Sarita', 'Sasikala', 'Sathya', 'Savithri', 'Shalini', 'Shanthi', 'Sharmila', 'Shilpa', 'Shivani', 'Shobana',
  'Shruthi', 'Sindhu', 'Sita', 'Sivagami', 'Sneha', 'Sobhia', 'Sonia', 'Soundarya', 'Sowmya', 'Sripriya',
  'Sruti', 'Subashini', 'Sudha', 'Sujatha', 'Sumathi', 'Sunitha', 'Sushma', 'Swathi', 'Swetha', 'Tamilselvi'
];

const lastNames = [
  'Iyer', 'Iyengar', 'Pillai', 'Mudaliar', 'Nadar', 'Chettiar', 'Gounder', 'Naidu', 'Reddy', 'Rao',
  'Balasubramanian', 'Chandrasekhar', 'Ganesan', 'Gopalakrishnan', 'Govindarajan', 'Ilangovan', 'Jayaraman', 'Karthikeyan', 'Krishnan', 'Krishnaswamy',
  'Mahadevan', 'Narayanan', 'Padmanabhan', 'Parthasarathy', 'Radhakrishnan', 'Rajagopal', 'Rajaram', 'Rajendran', 'Raman', 'Ramanathan',
  'Ramaswamy', 'Rangarajan', 'Ravichandran', 'Sankar', 'Sankaran', 'Seshadri', 'Srinivasan', 'Subramanian', 'Sundaram', 'Suryanarayanan',
  'Swaminathan', 'Thyagarajan', 'Varadarajan', 'Venkataraman', 'Venkatesan', 'Viswanathan'
];

function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const candidates = await prisma.candidate.findMany();
  
  console.log(`Updating ${candidates.length} candidates...`);
  
  for (const candidate of candidates) {
    const newName = getRandomName();
    const emailPrefix = newName.toLowerCase().replace(/\s+/g, '.');
    const newEmail = `${emailPrefix}@example.com`;
    
    // We update email as well just in case they are completely randomized
    // but Prisma might throw unique constraint if email already exists, 
    // so we can append some random numbers to email
    const uniqueEmail = `${emailPrefix}.${Math.floor(Math.random() * 10000)}@example.com`;
    
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        name: newName,
        email: uniqueEmail
      }
    });
  }
  
  const applications = await prisma.jobApplication.findMany();
  console.log(`Updating ${applications.length} applications...`);
  
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 30); // up to 30 days ago
  
  for (const app of applications) {
    const appliedAt = getRandomDate(past, now);
    
    await prisma.jobApplication.update({
      where: { id: app.id },
      data: {
        appliedAt: appliedAt
      }
    });
  }

  console.log('Successfully updated candidates and applications.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
