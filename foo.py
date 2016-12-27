print "Hello world", 'I Love PPL'
a = 1 + 1
b = a + 2
c = 0
if a == 2:
	c = 1
elif a < 2:
	c = 2
else:
	c = 3
print c
d = [1, 2, 3, 4]
for i in d:
	print i+4
while c < 10:
	print c
	c += 1
def fi(x=20):
	if x == 0:
		return 1
	elif x == 1:
		return 1
	else:
		return fi(x-1) + fi(x-2)
e = fi(5)
print e
class Point:
	def __init__(self, x, y):
		self.x = x
		self.y = y
	def get_point(self):
		print x, y
class People(Point):
	def get_people(self, x="Peng", *height_wight, **attribute):
		print "I am ",x
		for item in height_wight:
			print item
		for attri,value in attribute.items():
			print attri, " : ", value

p = Point(5, 7)
print p.x
print p.y
h = []
f = ()
k = {}
g = [i for i in [5,10,15,20] if i % 10 == 0]
h = (1,2,g)
i = {1,2,"h"}
j = {"Hello": 1, 2: h, 3: "Nice to see you"}

l = 8**2
