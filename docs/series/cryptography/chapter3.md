# Chapter 3: Private-Key Encryption

上一讲中提到，完善保密加密方案虽然在理论上是可行的，但是其要求的条件非常严苛，实际应用也存在诸多问题. 为了解决这些问题，我们可以对条件进行放宽，允许加密方案在某些情况下可能会泄露部分信息，但是这种泄露必须是可控的，这就是本讲要提到的也是现代密码学非常重要的概念：**计算安全(Computational Security)**.

## Computational Security

首先需要介绍<strong>信息论安全(Information-Theoretic Security)</strong>的概念：如果一个加密方案是信息论安全的，那么无论攻击者拥有多少计算资源，都无法从密文中获得关于明文的任何信息. 这在数学上的表述实际上就是完善保密的定义，其核心思想就是“一个加密方案的安全性仅依赖于概率论和信息论，而不依赖于攻击者的计算能力”.

在此基础上可以解释何为计算安全. 我们将刚刚提到的“可控泄漏”形式化，具体来说，我们对信息论安全的定义进行调整，引入两个放宽条件：

- **限制算力**：安全性仅针对在“可行时间”内运行的有效攻击者（即如果我们能使攻破加密方案需要的资源大于任何攻击者能够在合理时间内使用的资源，那么我们就认为这个加密方案是安全的）.
- **允许微小失败概率**：攻击者可能有极小的概率破解系统，但这个概率必须是可忽略的.

尽管如此，这样的定义还是不够精确，我们需要用数学的语言准确描述如何通过上述放宽条件来定义计算安全. 书中给出了两种定义方式：**确定方法(Concrete Approach)** 和 **渐近方法(Asymptotic Approach)**.

### Concrete Approach

确定方法就是显式指定攻击者的资源限制和允许的失败概率. 可以以如下的格式来定义计算安全：

::: thm Computational Security (Concrete Approach)
一个方案 $\Pi$ 是 $(t, \varepsilon)$-安全的，如果对于任何在时间 $t$ 内运行的攻击者，其成功攻破 $\Pi$ 的概率不超过 $\varepsilon$.
:::

但是精准并且确定的安全保证一般是难以给出的，比如声称一个方案没有攻击者能在 5 年内以大于 $\varepsilon$ 的概率破解它，但是它会引出一些问题：我们如何确定攻击者能使用什么样的算力？是否考虑到了未来技术的发展？该估计是假设使用"现成的"算法，还是针对攻击优化的专用硬件？总而言之，这些问题使得确定方法在实际应用中存在困难，更常使用的是渐近方法.

### Asymptotic Approach

渐近方法则是通过引入一个安全参数 $n$ 来定义计算安全. 我们要求：

- 诚实方(Honest Parties，即遵守协议的参与者)与攻击者都必须在多项式时间内运行，即存在多项式 $p(x)$ 使得运行时间不超过 $p(n)$，且攻击者算法可以是随机化的，这样的算法被称为是<strong>概率多项式(Probabilistic Polynomial-Time, PPT)</strong>的.
- 攻击者获胜的概率必须是 $n$ 的可忽略(negligible)函数，记为 $\text{negl}(n)$，定义为对于任何多项式 $p(x)$，存在一个整数 $N$ 使得对于所有的 $n > N$，攻击者获胜的概率小于 $1/p(n)$.

::: info collapse 这样要求的好处
- 根据 [Church-Turing Thesis](https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis)，任何合理的计算模型都可以被图灵机模拟，因此将计算时间限制在多项式范围内可以让我们无需考虑攻击者使用的具体计算模型，并且如果我们的分析表明某个算法可以在多项式时间内运行，那么该算法的任何合理实现都将在多项式时间内运行.
- 多项式时间算法满足理想的封闭性，即多项式时间算法的组合仍然是多项式时间算法，这使得我们在分析复杂协议时可以将其分解为多个子协议进行分析，而不必担心组合后的算法是否仍然在多项式时间内运行.
- 可忽略函数的定义使得任意多项式函数乘以一个可忽略函数仍然是可忽略的，因此如果一个多项式时间算法对某个子程序进行多项式次数的调用，而该子程序每次调用失败的概率都可忽略不计，那么对该子程序的任何一次调用失败的概率仍然是可忽略的，这使得我们在分析复杂协议时可以将其分解为多个子协议进行分析，而不必担心组合后的失败概率是否仍然是可忽略的.
:::

整理起来就是：

::: thm Computational Security (Asymptotic Approach)
一个方案 $\Pi$ 是安全的，如果对于任何 PPT 攻击者而言，攻击成功的概率是可忽略的，即对于任何多项式 $p(x)$，存在一个整数 $N$ 使得对于所有的 $n > N$，攻击者获胜的概率小于 $1/p(n)$.
:::

渐进方法的好处是它允许诚实方通过调整安全参数 $n$ 来将方案的安全性调整至一个合适的水平：一方面增加 $n$ 可以降低攻破概率，另一方面增加安全参数也会增加运行方案所需的时间以及密钥的长度，因此诚实方可以设置相对小的安全参数，以防御他们所关心的攻击类别同时保证性能.

::: example 一个使用渐进方法定义安全性的例子
考虑一个加密方案 $\Pi$，其安全参数为 $n$，诚实方运行时间为 $10^6 \cdot n^2$ 轮，而攻击者运行时间为 $10^8 \cdot n^4$ 轮时可以以概率 $2^{-n/2}$ 破解方案. 

如果所有参与方使用 2GHz 的电脑参与运算，诚实方设置 $n=80$，则诚实方的运行时间约为 $10^6 \cdot 80^2 = 6.4 \times 10^9$ 轮，即 $3.2$ 秒，而攻击者的运行时间约为 $10^8 \cdot 80^4 = 4.096 \times 10^{15}$ 轮，即 $2.048 \times 10^6$ 秒，约为 23.7 天，成功攻破的概率为 $2^{-40}$.

现在所有参与方将设备升级成 8GHz 的电脑，诚实方设置 $n=160$，则诚实方的运行时间约为 $10^6 \cdot 160^2 = 2.56 \times 10^{10}$ 轮，即 $3.2$ 秒，而攻击者的运行时间约为 $10^8 \cdot 160^4 = 6.5536 \times 10^{16}$ 轮，即 $8.192 \times 10^6$ 秒，约为 94.8 天，成功攻破的概率为 $2^{-80}$.

可以看到，使用渐进方法，在设备升级的情况下，诚实方可以通过增加安全参数来保持相同的运行时间，同时方案的安全性也能得到保证，甚至得到提升. 这也是渐进方法常用于实际应用的原因之一.

:::

当然不论是确定方法还是渐进方法，我们都没有涉及到两点：一是攻击者能采用什么样的攻击方式（即威胁模型），二是如何定义攻击者的成功（即安全保证）. 不过这和我们刚刚提到的讨论并不冲突，事实上直接将这些填入上述定义中就可以了，这也是后面会经常看到的安全定义的形式：

::: thm Computational Security (General Form)
一个方案 $\Pi$ 是安全的，如果对于任何 PPT 攻击者 $\mathcal{A}$，攻击者（以某种攻击方式）进行攻击，其成功攻破 $\Pi$（即满足某种安全保证）的概率是可忽略的，即对于任何多项式 $p(x)$，存在一个整数 $N$ 使得对于所有的 $n > N$，攻击者 $\mathcal{A}$ 成功攻破 $\Pi$ 的概率小于 $1/p(n)$.
:::

<!-- ## Private-Key Encryption in Computational Security

在介绍了计算安全的定义之后，我们以私钥加密为例看看如何在计算安全的框架下定义安全的加密方案. -->

## The Basic Definition of Security (EAV-Security)

我们之前提过，“安全”的要求是希望攻击者无法从密文中获得关于明文的部分信息，我们将其形式化为<strong>语义安全(Semantic Security)</strong>，这也是我们提出的第一个计算意义下的安全定义，但在此之前我们先介绍一个更为基础的定义：**不可区分性(Indistinguishability)**，也称为**被动攻击安全(EAV-Security)**.

在引入计算安全的定义之后，我们将上一讲中提出的[完善不可区分性](chapter2.md#perfect-adversarial-indistinguishability)的定义进行调整（对抗不可区分性实验的定义也相应调整），得到如下的定义：

::: thm Definition: Adversarial Indistinguishability Experiment $\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n)$

令 $\Pi = (\text{Gen}, \text{Enc}, \text{Dec})$ 是一个消息空间为 $\mathcal{M}$ 的加密方案，$\mathcal{A}$ 是一个攻击者算法. 对抗不可区分性实验 $\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n)$ 定义如下：

1. 准备阶段：攻击者 $\mathcal{A}$ 选择两个长度相同但内容不同的明文 $m_0, m_1 \in \mathcal{M}$，并将它们提交给实验者.
2. 挑战阶段：实验者随机选择一个比特 $b \in \{0, 1\}$，并使用密钥生成算法 $\text{Gen}(1^n)$ 生成一个密钥 $k$. 然后，实验者计算挑战密文(challenge ciphertext) $c \leftarrow \text{Enc}_k(m_b)$ 并将其发给 $\mathcal{A}$.
3. 猜测阶段：攻击者 $\mathcal{A}$ 接收到密文 $c$ 后，输出一个猜测 $b' \in \{0, 1\}$，试图猜测 $b$ 的值.
4. 判定阶段：如果 $b' = b$，则称攻击者则成功区分了两个明文，实验返回 1，否则返回 0.

:::

::: thm Definition 3.8: EAV-Security

对于一个加密方案 $\Pi$，若对所有概率多项式时间攻击者 $\mathcal{A}$，存在可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，
$$\Pr[\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n) = 1] \leqslant \dfrac{1}{2} + \text{negl}(n), $$
则称该加密方案是 EAV-Secure 的.

:::

有时我们会使用另外一个等价的定义，注意到若攻击者不论观察到哪个明文的密文，其表现都几乎一样，那样的话方案在计算安全的意义下就是安全的，因此我们可以将上述定义中的攻击者成功区分两个明文的概率与攻击者成功区分 $b=0$ 和 $b=1$ 的概率进行比较，得到如下的定义：

::: thm Definition 3.9: EAV-Security (Equivalent Form)
我们记 $\text{out}_\mathcal{A}(\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n, b))$ 为攻击者 $\mathcal{A}$ 在对抗不可区分性实验中的输出，其中 $b$ 是实验者在挑战阶段随机选择的比特. 则对于一个加密方案 $\Pi$，若对所有概率多项式时间攻击者 $\mathcal{A}$，存在可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，
$$\left| \Pr[\text{out}_\mathcal{A}(\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n, 0)) = 1] - \Pr[\text{out}_\mathcal{A}(\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n, 1)) = 1] \right| \leqslant \text{negl}(n), $$
则称该加密方案是 EAV-Secure 的.

:::

## Semantic Security

虽然 EAV 安全在数学上非常简洁，但它并没有直接回答我们最关心的问题：加密方案是否真的保护了明文的所有信息？<strong>语义安全</strong>的形式化定义正是为了捕捉这种直观想法：无论攻击者拥有什么样的先前知识，观察到密文都不会让他获得关于明文的任何额外“信息”（哪怕是一个比特的信息）.

在给出语义安全的完整定义之前，先来看一个稍弱但非常直观的结论：如果一个方案是 EAV 安全的，那么攻击者就无法以显著优于 $\dfrac{1}{2}$ 的概率猜中明文的任何一个特定位.

::: thm Theorem 3.10: What EAV-Security Implies
设 $\Pi=(\text{Enc}, \text{Dec})$ 是一个消息固定长度为 $\ell$ 的私钥加密方案（$\text{Gen}$ 被省略时表明密钥是一个随机的 $n$ 位字符串），如果 $\Pi$ 是 EAV-Secure 的，那么对于任意的 PPT 攻击者 $\mathcal{A}$ 和任意的 $i \in \{1, 2, \ldots, \ell\}$，存在一个可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，
$$\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow \{0, 1\}^\ell}[\mathcal{A}(1^n, \text{Enc}_k(m)) = m_i] \leqslant \dfrac{1}{2} + \text{negl}(n), $$
其中 $m_i$ 表示明文 $m$ 的第 $i$ 位.
:::

::: proof collapse 定理之证明
我们在这里介绍一种证明方法：<strong>归约证明(Proof of Reduction)</strong>. 归约证明的核心思想是通过构造另一个攻击者算法 $\mathcal{B}$，将攻击者 $\mathcal{A}$ 的成功攻击转化为 $\mathcal{B}$ 的成功攻击，而后者是不符合我们的假设的，从而得出结论. 

在这里定义 $\mathcal{A}$ 的成功攻击为 $\mathcal{A}$ 能以显著优于 $\dfrac{1}{2}$ 的概率猜中明文的第 $i$ 位，如果我们能构造一个攻击者 $\mathcal{A}'$，使得 $\mathcal{A}'$ 的成功攻击意味着 $\Pi$ 的 EAV 安全性被破坏，且 $\mathcal{A}$ 的成功攻击能够转化为 $\mathcal{A}'$ 的成功攻击，那么我们就完成了证明.

我们记 $I_0 \subset \{0, 1\}^\ell$ 为所有明文 $m$ 满足 $m_i = 0$ 的集合，$I_1 \subset \{0, 1\}^\ell$ 为所有明文 $m$ 满足 $m_i = 1$ 的集合. 构造攻击者 $\mathcal{A}'$ 如下：

1. $\mathcal{A}'$ 随机选择一个 $m_0 \in I_0$ 和一个 $m_1 \in I_1$，并将它们提交给 EAV 实验的准备阶段.
2. 在挑战阶段，$\mathcal{A}'$ 接收挑战密文 $c \leftarrow \text{Enc}_k(m_b)$ 后，将 $\mathcal{A}(1^n, c)$ 的输出作为 $\mathcal{A}'$ 的猜测比特 $b'$.

由于 $\mathcal{A}$ 是 PPT 的，故根据 $\mathcal{A}'$ 的构造可知 $\mathcal{A}'$ 也是 PPT 的，且

$$\begin{aligned}
&\quad\Pr[\text{PrivK}_{\mathcal{A}', \Pi}^\text{eav}(n) = 1] \\ &= \Pr_{k \leftarrow \{0, 1\}^n, b \leftarrow \{0, 1\}}[\mathcal{A}(1^n, \text{Enc}_k(m_b)) = b] \\
&= \dfrac{1}{2} \cdot \Pr_{k \leftarrow \{0, 1\}^n}[\mathcal{A}(1^n, \text{Enc}_k(m_0)) = 0] + \dfrac{1}{2} \cdot \Pr_{k \leftarrow \{0, 1\}^n}[\mathcal{A}(1^n, \text{Enc}_k(m_1)) = 1] \\
&= \dfrac{1}{2} \cdot \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow I_0}[\mathcal{A}(1^n, \text{Enc}_k(m)) = 0] + \dfrac{1}{2} \cdot \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow I_1}[\mathcal{A}(1^n, \text{Enc}_k(m)) = 1] \\
&= \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow \{0, 1\}^\ell}[\mathcal{A}(1^n, \text{Enc}_k(m)) = m_i] 
\end{aligned}$$

也就是说 $\mathcal{A}$ 攻击成功的概率和 $\mathcal{A}'$ 攻击成功的概率是相同的，因此如果 $\mathcal{A}$ 能以显著优于 $\dfrac{1}{2}$ 的概率猜中明文的第 $i$ 位，那么 $\mathcal{A}'$ 就能以显著优于 $\dfrac{1}{2}$ 的概率区分 $m_0$ 和 $m_1$，从而破坏 $\Pi$ 的 EAV 安全性. 因此 $\mathcal{A}$ 的成功攻击的概率必须不超过 $\dfrac{1}{2}+\text{negl}(n)$，这就完成了证明.

:::

利用类似的思路，我们可以得到一个更强的定理：

::: thm Theorem 3.11: What EAV-Security Implies (Stronger Version)
设 $\Pi=(\text{Enc}, \text{Dec})$ 是一个消息固定长度为 $\ell$ 的私钥加密方案，如果 $\Pi$ 是 EAV-Secure 的，那么对于任意的 PPT 攻击者 $\mathcal{A}$，存在 PPT 攻击者 $\mathcal{A}'$，使得对于 $\{0, 1\}^\ell$ 上的任意消息分布 $M$ 和任意的函数 $f:\{0, 1\}^\ell \to \{0, 1\}$，存在一个可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，
$$\left|\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(m)) = f(m)] - \Pr_{m \leftarrow M}[\mathcal{A}'(1^n) = f(m)]\right| \leqslant \text{negl}(n). $$
:::

::: proof collapse 定理之证明
要证明这个问题需要注意到 EAV 安全的意义：对于任意的消息分布 $M$，任何攻击者都无法以显著的概率区分 $\text{Enc}_k(m)$ 和 $\text{Enc}_k(m')$，其中 $m$ 和 $m'$ 是从 $M$ 中独立抽取的两个消息. 也就是说，攻击者根据 $\text{Enc}_k(m)$ 计算出 $f(m)$ 的概率和攻击者根据 $\text{Enc}_k(m')$ 计算出 $f(m)$ 的概率几乎相同. 特别的，我们取 $m'$ 为一个与 $m$ 无关的常量，比如 $1^\ell$，则可以说明攻击者根据 $\text{Enc}_k(m)$ 计算出 $f(m)$ 的概率和不依赖于 $m$ 的攻击者计算出 $f(m)$ 的概率几乎相同，从而完成证明.

根据上述表述我们构造攻击者 $\mathcal{A}'$ 如下：

1. $\mathcal{A}'$ 只接收一个输入 $1^n$，随机生成密钥 $k$，计算 $c \leftarrow \text{Enc}_k(1^\ell)$，并将 $c$ 作为输入提交给 $\mathcal{A}$.
2. $\mathcal{A}'$ 接收 $\mathcal{A}$ 的输出 $f' \in \{0, 1\}$ 后，将其作为 $\mathcal{A}'$ 的输出.

从而 $\mathcal{A}'$ 的成功攻击的概率为 
$$\Pr_{m \leftarrow M}[\mathcal{A}'(1^n) = f(m)] = \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(1^\ell)) = f(m)].$$

这样问题就转化为了：对于任意的 PPT 攻击者 $\mathcal{A}$，任意的消息分布 $M$ 和任意的函数 $f$，存在一个可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，

$$\left|\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(m)) = f(m)] - \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(1^\ell)) = f(m)]\right| \leqslant \text{negl}(n). $$

这就变成了我们一开始的表述，当然直接采用是不太严谨的，我们将其规范化，同样是采用归约证明的思路. 我们构造攻击者 $\mathcal{B}$ 如下：

1. $\mathcal{B}$ 设置两个明文 $m_0 = m$ 和 $m_1 = 1^\ell$，并将它们提交给 EAV 实验的准备阶段.
2. 在挑战阶段，$\mathcal{B}$ 接收挑战密文 $c \leftarrow \text{Enc}_k(m_b)$，将 $c$ 作为输入提交给 $\mathcal{A}$，接收 $\mathcal{A}$ 的输出 $f' \in \{0, 1\}$.
3. 若 $f' = f$，则 $\mathcal{B}$ 输出 $b' = 0$，否则输出 $b' = 1$.

由于 $\mathcal{A}$ 是 PPT 的，故根据 $\mathcal{B}$ 的构造可知 $\mathcal{B}$ 也是 PPT 的，且

- 若实验者选择 $b=0$，则 $\mathcal{B}$ 输出 $b' = 0$ 的概率为 $\mathcal{A}$ 根据 $\text{Enc}_k(m)$ 计算出 $f(m)$ 的概率，即 $\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(m)) = f(m)]$.
- 若实验者选择 $b=1$，则 $\mathcal{B}$ 输出 $b' = 0$ 的概率为 $\mathcal{A}$ 根据 $\text{Enc}_k(1^\ell)$ 计算出 $f(m)$ 的概率，即 $\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(1^\ell)) = f(m)]$.

根据 EAV 安全的等价定义可知
$$\left| \Pr[\text{out}_\mathcal{B}(\text{PrivK}_{\mathcal{B}, \Pi}^\text{eav}(n, 0)) = 0] - \Pr[\text{out}_\mathcal{B}(\text{PrivK}_{\mathcal{B}, \Pi}^\text{eav}(n, 1)) = 0] \right| \leqslant \text{negl}(n),$$

替换可得
$$\left|\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(m)) = f(m)] - \Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow M}[\mathcal{A}(1^n, \text{Enc}_k(1^\ell)) = f(m)]\right| \leqslant \text{negl}(n), $$

这就完成了证明.

:::

语义安全比该定理考虑的还要全面，它假设攻击者可能对明文分布有一定的了解（通过多项式时间采样算法 $\text{Samp}$），并且已经掌握了一些关于明文的背景信息函数 $h(m)$，同时允许不同长度的消息.

::: thm Definition 3.12: Semantic Security
称一个私钥加密方案 $\Pi=(\text{Enc}, \text{Dec})$ 是语义安全的，如果对于任意的 PPT 攻击者 $\mathcal{A}$，存在 PPT 攻击者 $\mathcal{A}'$，使得对于任意的 PPT 采样算法 $\text{Samp}$ 和任意多项式时间可计算的函数 $f$ 和 $h$，存在一个可忽略函数 $\text{negl}(n)$ 使得对 $\forall\, n$，
$$\left|\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow \text{Samp}(1^n)}[\mathcal{A}(1^n, \text{Enc}_k(m), h(m)) = f(m)] - \Pr_{m \leftarrow \text{Samp}(1^n)}[\mathcal{A}'(1^n, |m|, h(m)) = f(m)]\right| \leqslant \text{negl}(n). $$
:::

有些令人惊讶的是，尽管语义安全的定义看起来比 EAV 安全复杂得多，但实际上它们是等价的：

::: thm Theorem 3.13: EAV-Security is equivalent to Semantic Security
一个私钥加密方案 $\Pi$ 是 EAV-Secure 的当且仅当 $\Pi$ 是语义安全的.
:::

::: proof collapse 定理之证明
必要性：实际上和定理 3.11 是一样的，只需要将多出来的条件补充到表达式中即可.

充分性：假设攻击者 $\mathcal{A}$ 参与了 EAV 实验 $\text{PrivK}_{\mathcal{A}, \Pi}^\text{eav}(n)$，选择了两个明文 $m_0$ 和 $m_1$，我们令采样算法 $\text{Samp}$ 接收输入 $1^n$ 等概率输出 $m_0$ 和 $m_1$，令函数 $f$ 输出 $b$ 当 $m=m_b$，令 $h(m)$ 为空函数，根据语义安全的定义，存在一个 PPT 攻击者 $\mathcal{A}'$，它不根据密文猜测 $f(m)$ 的概率与 $\mathcal{A}$ 根据密文猜测 $f(m)$ 的概率几乎相同，而由于 $m_0, m_1$ 等概率出现，且 $f(m_0) = 0$，$f(m_1) = 1$，因此猜对 $f(m)$ 的概率也就是猜对 $b$ 的概率（即区分 $m_0$ 和 $m_1$ 的概率），因此 
$$\Pr_{k \leftarrow \{0, 1\}^n, m \leftarrow \text{Samp}(1^n)}[\mathcal{A}(1^n, \text{Enc}_k(m), h(m)) = f(m)]$$ 
表示 $\mathcal{A}$ 在 EAV 实验中成功区分 $m_0$ 和 $m_1$ 的概率，而 
$$\Pr_{m \leftarrow \text{Samp}(1^n)}[\mathcal{A}'(1^n, |m|, h(m)) = f(m)]$$
表示 $\mathcal{A}'$ 随机猜测 $b$ 的概率（为 $\dfrac{1}{2}$），根据语义安全的定义，二者的差距是可忽略的，因此 $\Pi$ 是 EAV-Secure 的. 充分性得证.
:::

这一定理意义重大，因为：

- 语义安全是我们想要的目标：在计算安全的意义下，它保证了绝对的隐私（除了长度外不泄露任何信息），并且它保证了即使攻击者已经知道明文的部分信息（比如知道这是一份工资单，或者知道明文的统计特征），看到密文后，攻击者也无法获得**任何额外的**信息.
- EAV 安全是我们使用的工具：它的定义非常简洁，且在证明中更容易使用（尤其是在归约证明中，通过上面的例子可以看出）.

因此我们可以通过证明 EAV 安全来证明语义安全，这也是后续章节中我们说明某个加密方案是安全的常用方法.