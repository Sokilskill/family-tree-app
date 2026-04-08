import { motion } from "motion/react";
import { Edit, Heart, Network, Search, Shield, Users } from "lucide-react";
import { Link } from "react-router";

import { Button } from "../components/ui/button";

const features = [
  { icon: Users, title: "Інтерактивне дерево", description: "Візуалізуйте зв'язки між родичами з автоматичним розташуванням.", color: "from-blue-500 to-cyan-500" },
  { icon: Search, title: "Пошук та фільтри", description: "Швидко знаходьте родичів за іменами, датами чи іншими критеріями.", color: "from-purple-500 to-pink-500" },
  { icon: Edit, title: "Редагування", description: "Оновлюйте інформацію про кожного члена родини в кілька кліків.", color: "from-orange-500 to-red-500" },
  { icon: Heart, title: "Історії та факти", description: "Зберігайте важливі моменти, спогади та сімейні історії.", color: "from-pink-500 to-rose-500" },
  { icon: Network, title: "Зручна навігація", description: "Легко орієнтуйтеся між поколіннями та родинними зв'язками.", color: "from-green-500 to-emerald-500" },
  { icon: Shield, title: "Безпека даних", description: "Ваші дані зберігаються в безпечному середовищі Firebase.", color: "from-indigo-500 to-blue-500" },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <Network className="h-8 w-8 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">Родинне Дерево</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
            <Link to="/login"><Button variant="ghost" className="rounded-full">Вхід</Button></Link>
            <Link to="/register"><Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Реєстрація</Button></Link>
          </motion.div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 text-5xl font-bold md:text-6xl">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Збережіть історію</span>
            <br />
            <span className="text-gray-800">вашої родини</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Створіть інтерактивне родинне дерево, додавайте фотографії, історії та зберігайте спогади для майбутніх поколінь.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex justify-center gap-4">
            <Link to="/register"><Button size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 text-lg hover:from-purple-700 hover:to-pink-700">Почати безкоштовно</Button></Link>
            <Link to="/tree"><Button size="lg" variant="outline" className="rounded-full px-8 text-lg">Переглянути демо</Button></Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="relative mt-16">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
              <Network className="h-32 w-32 text-purple-400 opacity-50" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Все необхідне для вашої родини</h2>
          <p className="text-xl text-gray-600">Потужні інструменти для створення та збереження родинної історії.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="leading-relaxed text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Почніть будувати своє родинне дерево сьогодні</h2>
          <p className="mb-8 text-xl text-purple-100">Приєднуйтеся до родин, які вже зберігають свою історію в цифровому форматі.</p>
          <Link to="/register"><Button size="lg" className="rounded-full bg-white px-8 text-lg text-purple-600 hover:cursor-pointer hover:bg-gray-100">Створити безкоштовний акаунт</Button></Link>
        </motion.div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 md:flex-row sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <Network className="h-6 w-6 text-purple-600" />
            <span className="font-semibold text-gray-900">Родинне Дерево</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Всі права захищені</p>
        </div>
      </footer>
    </div>
  );
}
