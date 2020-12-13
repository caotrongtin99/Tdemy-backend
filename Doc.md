# Role:
- 0: Base User
- 1: Teacher
- 2: Admin

# User API:
- Create(): require(none)
- GetAll(): require(Admin)
- GetDetail(params: id): require(Owner or Admin)
- Update(params: id): require(Owner or Admin)
- Delete(params: id): require(Owner or Admin)

# Course API:
- Create(): require(Teacher)
- GetAll(params: limit, offset): require(none)
- GetDetail(params: id or code): require(none) (Not include chapter list)
- Update(params: id or code): require(Owner and Teacher)
- Delete(params: id or code): require(Owner and Teacher)

# Chapter API:
- Create(params: course_id): require(Owner of course)
- GetAll(params: limit, offset): require(Enroll or Owner)
- GetDetail(params: id, course_id): require(Enroll or Owner)
- Update(params: id, course_id): require(Owner)
- Delete(params: id: require(Owner)

# FeedBack API:
- Create(params: course_id): require((User and Enroll) or Teacher)
- GetAll(params: limit, offset): require(none)
- Update(params: id, course_id): require(Owner)
- Delete(params: id, course_id): require(Owner)