-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "studentId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("studentId","questionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_username_key" ON "Teacher"("username");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
