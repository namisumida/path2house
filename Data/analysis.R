### Path to House project

## 1) Merge datasets 
# Read in and change data types
members <- read.csv(file.choose())
paths <- read.csv(file.choose())
paths <- paths[-c(435,436),] # delete the last two rows - summary rows
paths$new <- ifelse(paths$party=="", 0, 1)
merged <- merge(paths, members[c("full_name", "gender", "state", "party")], by=c("full_name", "state"), all.x=TRUE) # MERGE
#merged[which(is.na(merged$gender) & merged$party.x==""),]$full_name #check which ones couldn't merge
# merge the party variables 
merged$party.x <- as.character(merged$party.x)
merged$party.y <- as.character(merged$party.y)
merged$party <- ifelse(merged$party.x=="", merged$party.y, merged$party.x)
# separate out college variable into multiple 
merged$college_none <- ifelse(merged$edu_college=="none", 1, 0)
merged$college_public <- ifelse(merged$edu_college=="public", 1, 0)
merged$college_private <- ifelse(merged$edu_college=="private", 1, 0)
merged$college_elite <- ifelse(merged$edu_college=="elite", 1, 0)
# remove unnecessary variables
merged <- subset(merged,select = -c(party.x, party.y, first_name, last_name, edu_college))
# convert to numeric 
for (i in 4:27) {
  merged[,i] <- ifelse(merged[,i]=="1", 1, 0)
}
# export
write.csv(merged, 'merged.csv', row.names = FALSE)

# Create a dataset with topline counts for each experience 
experience <- c("college_none", "college_public", "college_private", "college_elite")
count <- c(sum(merged$edu_college=="none"), sum(merged$edu_college=="public"), sum(merged$edu_college=="private"), sum(merged$edu_college=="elite"))
counts <- data.frame(cbind(experience, count))
counts$experience <- as.character(counts$experience)
counts$count <- as.numeric(as.character(counts$count))
for (i in 4:27) {
  counts <- rbind(counts, c(colnames(merged[i]), sum(merged[,i]==1)))
}
counts$count <- as.numeric(as.character(counts$count))
write.csv(counts, '../personal projects/path2house/Data/counts.csv', row.names = FALSE)


## 2) Analysis
summary(merged)

# Undergrad
table(merged$edu_college)/nrow(merged)*100

# Overlap
total <- nrow(merged)
output <- data.frame()
for (i in 4:27) {
  output_list <- list()
  for (j in 4:27) {
    output_list <- c(output_list, nrow(subset(merged, merged[,i]==1 & merged[,j]==1)))
  }
  output <- rbind(output, output_list)
}
colnames(output) <- colnames(merged[,c(4:27)])
rownames(output) <- colnames(merged[,c(4:27)])
View(output)