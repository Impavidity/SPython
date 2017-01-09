class Person:
	count_person = 0
	def __init__(self):
		self.name = ""
		self.age = 0
	def set_age(self, age):
		self.age = age
	def set_name(self, name):
		self.name = name
	def printHello(self,name="Peng"):
		print "Hello", name

p = Person()
p.printHello("Peng Shi")
