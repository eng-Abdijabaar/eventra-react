export default function RightSidebar() {
  const contacts = [
    { name: "Jane Doe", online: true },
    { name: "John Smith", online: true },
    { name: "Alice Johnson", online: false },
  ];

  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-2 pl-4 py-4 hidden lg:block">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-gray-500 text-[15px]">Contacts</h3>
        <div className="flex gap-3 text-gray-500">
          <button className="hover:bg-gray-200 p-1.5 rounded-full transition">🔍</button>
          <button className="hover:bg-gray-200 p-1.5 rounded-full transition">⚙️</button>
        </div>
      </div>

      <div className="space-y-1">
        {contacts.map((contact, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200 cursor-pointer transition">
            <div className="relative">
              <img 
                src={`https://i.pravatar.cc/150?img=${idx + 10}`} 
                alt={contact.name} 
                className="w-9 h-9 rounded-full object-cover"
              />
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-fb-bg"></div>
              )}
            </div>
            <span className="font-medium text-[15px]">{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}